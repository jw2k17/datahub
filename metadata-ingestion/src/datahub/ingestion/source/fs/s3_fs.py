import boto3
import smart_open
from dataclasses import dataclass
from datahub.ingestion.source.fs.fs_base import FileSystem, FileInfo
from datahub.ingestion.source.fs.s3_list_iterator import S3ListIterator
from urllib.parse import urlparse
from typing import Iterable


def parse_s3_path(path: str):
    parsed = urlparse(path)
    return S3Path(parsed.netloc, parsed.path.lstrip('/'))


def assert_ok_status(s3_response):
    is_ok = s3_response['ResponseMetadata']['HTTPStatusCode'] == 200
    assert is_ok, f"Failed to fetch S3 object, error message: {s3_response['Error']['Message']}"


@dataclass
class S3Path:
    bucket: str
    key: str

    def __str__(self):
        return f"S3Path({self.bucket}, {self.key})"


class S3FileSystem(FileSystem):

    def __init__(self, **kwargs):
        self.s3 = boto3.client('s3', **kwargs)

    @classmethod
    def create(cls, **kwargs):
        return S3FileSystem(**kwargs)

    def open(self, path: str, **kwargs):
        transport_params = kwargs.update({'client': self.s3})
        return smart_open.open(path, mode='rb', transport_params=transport_params)

    def file_status(self, path: str) -> FileInfo:
        s3_path = parse_s3_path(path)
        try:
            response = self.s3.get_object_attributes(
                Bucket=s3_path.bucket,
                Key=s3_path.key,
                ObjectAttributes=['ObjectSize']
            )
            assert_ok_status(response)
            return FileInfo(path, response['ObjectSize'], is_file=True)
        except Exception as e:
            if hasattr(e, 'response') and e.response['ResponseMetadata']['HTTPStatusCode'] == 404:
                return FileInfo(path, 0, is_file=False)
            else:
                raise e

    def list(self, path: str) -> Iterable[FileInfo]:
        s3_path = parse_s3_path(path)
        return S3ListIterator(self.s3, s3_path.bucket, s3_path.key)
