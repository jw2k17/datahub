# This script checks the shadow jar to ensure that we only have allowed classes being exposed through the jar
jarFiles=$(find build/libs -name "datahub-spark-lineage*.jar" | grep -v sources | grep -v javadoc)
for jarFile in ${jarFiles}; do
jar -tvf $jarFile |\
      grep -v "datahub/shaded" |\
      grep -v "META-INF" |\
      grep -v "com/linkedin" |\
      grep -v "com/datahub" |\
      grep -v "datahub" |\
      grep -v "entity-registry" |\
      grep -v "pegasus/" |\
      grep -v "legacyPegasusSchemas/" |\
      grep -v " com/$" |\
      grep -v "git.properties" |\
      grep -v "client.properties" |\
      grep -v "module-info.class"

if [ $? -ne 0 ]; then
  echo "✅ No unexpected class paths found in ${jarFile}"
else
  echo "💥 Found unexpected class paths in ${jarFile}"
  exit 1
fi
done
exit 0
