package com.linkedin.metadata.search.elasticsearch.indexbuilder;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import java.util.List;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * Builder for generating settings for elasticsearch indices
 */
public class SettingsBuilder {

  // ElasticSearch Property Map Keys
  public static final String ALL = "all";
  public static final String ANALYSIS = "analysis";
  public static final String ANALYZER = "analyzer";
  public static final String FIELDDATA = "fielddata";
  public static final String FIELDS = "fields";
  public static final String FILTER = "filter";
  public static final String FILTERS = "filters";
  public static final String IGNORE_CASE = "ignore_case";
  public static final String KEYWORD = "keyword";
  public static final String LENIENT = "lenient";
  public static final String MAX_NGRAM_DIFF = "max_ngram_diff";
  public static final String MIN_SHINGLE_SIZE = "min_shingle_size";
  public static final String MAX_SHINGLE_SIZE = "max_shingle_size";
  public static final String NGRAM = "ngram";
  public static final String NORMALIZER = "normalizer";
  public static final String PATTERN = "pattern";
  public static final String PATTERNS = "patterns";
  public static final String PRESERVE_ORIGINAL = "preserve_original";
  public static final String SEARCH_ANALYZER = "search_analyzer";
  public static final String SPLIT_ON_NUMERICS = "split_on_numerics";
  public static final String STOPWORDS = "stopwords";
  public static final String SYNONYMS = "synonyms";
  public static final String TOKENIZER = "tokenizer";
  public static final String TYPE = "type";
  public static final String TYPE_TABLE = "type_table";

  // Analyzers
  public static final String BROWSE_PATH_HIERARCHY_ANALYZER = "browse_path_hierarchy";
  public static final String KEYWORD_LOWERCASE_ANALYZER = "custom_keyword";
  public static final String PARTIAL_ANALYZER = "partial";
  public static final String SLASH_PATTERN_ANALYZER = "slash_pattern";
  public static final String TEXT_ANALYZER = "word_delimited";
  public static final String TEXT_SEARCH_ANALYZER = "query_word_delimited";
  public static final String URN_ANALYZER = "urn_component";
  public static final String URN_SEARCH_ANALYZER = "query_urn_component";

  // Filters
  public static final String ALPHA_ONLY = "alpha_only";
  public static final String ASCII_FOLDING = "asciifolding";
  public static final String COLON_SUBWORD_DELIMITER = ": => SUBWORD_DELIM";
  public static final String CUSTOM_DELIMITER = "custom_delimiter";
  public static final String CUSTOM_DELIMITER_GRAPH = "custom_delimiter_graph";
  public static final String DEFAULT_SYN_GRAPH = "default_syn_graph";
  public static final String FLATTEN_GRAPH = "flatten_graph";
  public static final String LOWERCASE = "lowercase";
  public static final String MIN_LENGTH_2 = "min_length_2";
  public static final String MULTIFILTER = "multifilter";
  public static final String MULTIFILTER_GRAPH = "multifilter_graph";
  public static final String PARTIAL_URN_COMPONENT = "partial_urn_component";
  public static final String SHINGLE_2_3 = "shingle_2_3";
  public static final String SNOWBALL = "snowball";
  public static final String STEM_OVERRIDE = "stem_override";
  public static final String STOP = "stop";
  public static final String TRIM_COLON = "trim_colon";
  public static final String UNIQUE = "unique";
  public static final String URN_STOP = "urn_stop";
  public static final String WORD_DELIMITER = "word_delimiter";
  public static final String WORD_DELIMITER_GRAPH = "word_delimiter_graph";

  // MultiFilters
  public static final String MULTIFILTER_GRAPH_1 = String.join(",", CUSTOM_DELIMITER_GRAPH, TRIM_COLON, URN_STOP);
  public static final String MULTIFILTER_GRAPH_2 = String.join(LOWERCASE, DEFAULT_SYN_GRAPH);
  public static final String MULTIFILTER_GRAPH_3 = String.join(",", LOWERCASE, ALPHA_ONLY, DEFAULT_SYN_GRAPH);
  public static final String MULTIFILTER_1 = MULTIFILTER_GRAPH_1 + "," + FLATTEN_GRAPH;
  public static final String MULTIFILTER_2 = MULTIFILTER_GRAPH_2 + "," + FLATTEN_GRAPH;
  public static final String MULTIFILTER_3 = MULTIFILTER_GRAPH_3 + "," + FLATTEN_GRAPH;

  // Normalizers
  public static final String KEYWORD_NORMALIZER = "keyword_normalizer";

  // Tokenizers
  public static final String KEYWORD_TOKENIZER = "keyword";
  public static final String MAIN_TOKENIZER = "main_tokenizer";
  public static final String PATH_HIERARCHY_TOKENIZER = "path_hierarchy";
  public static final String SLASH_TOKENIZER = "slash_tokenizer";

  public static final List<String> ALPHA_ONLY_PATTERNS = ImmutableList.of("([a-z0-9]{2,})");
  public static final List<String> URN_STOP_WORDS = ImmutableList.of("urn", "li");

  public final Map<String, Object> settings;

  public SettingsBuilder(String mainTokenizer) {
    try {
      settings = buildSettings(mainTokenizer);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public Map<String, Object> getSettings() {
    return settings;
  }

  private static Map<String, Object> buildSettings(String mainTokenizer) throws IOException {
    ImmutableMap.Builder<String, Object> settings = ImmutableMap.builder();
    settings.put(MAX_NGRAM_DIFF, 17);
    settings.put(ANALYSIS, ImmutableMap.<String, Object>builder()
            .put(FILTER, buildFilters())
            .put(TOKENIZER, buildTokenizers())
            .put(NORMALIZER, buildNormalizers())
            .put(ANALYZER, buildAnalyzers(mainTokenizer))
            .build());
    return settings.build();
  }

  private static Map<String, Object> buildFilters() throws IOException {
    PathMatchingResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();

    ImmutableMap.Builder<String, Object> filters = ImmutableMap.builder();

    // Filter to split string into words
    filters.put(CUSTOM_DELIMITER, ImmutableMap.<String, Object>builder()
            .put(TYPE, WORD_DELIMITER)
            .put(SPLIT_ON_NUMERICS, false)
            .put(PRESERVE_ORIGINAL, true)
            .put(TYPE_TABLE, ImmutableList.of(
                    COLON_SUBWORD_DELIMITER
            ))
            .build());

    filters.put(CUSTOM_DELIMITER_GRAPH, ImmutableMap.<String, Object>builder()
            .put(TYPE, WORD_DELIMITER_GRAPH)
            .put(SPLIT_ON_NUMERICS, false)
            .put(PRESERVE_ORIGINAL, true)
            .put(TYPE_TABLE, ImmutableList.of(
                    COLON_SUBWORD_DELIMITER
            ))
            .build());

    filters.put(URN_STOP, ImmutableMap.<String, Object>builder()
            .put(TYPE, STOP)
            .put(IGNORE_CASE, "true")
            .put(STOPWORDS, URN_STOP_WORDS)
            .build());

    filters.put(TRIM_COLON, ImmutableMap.<String, Object>builder()
            .put(TYPE, "pattern_replace")
            .put(ALL, "false")
            .put(PATTERN, ":$")
            .put("replacement", "")
            .build());

    filters.put(MIN_LENGTH_2, ImmutableMap.<String, Object>builder()
            .put(TYPE, "length")
            .put("min", "2")
            .build());

    Resource stemOverride = resourceResolver.getResource("classpath:elasticsearch/stem_override.txt");
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(stemOverride.getInputStream()))) {
      filters.put(STEM_OVERRIDE, ImmutableMap.<String, Object>builder()
              .put(TYPE, "stemmer_override")
              .put("rules", reader.lines()
                      .map(String::trim)
                      .map(String::toLowerCase)
                      .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                      .collect(Collectors.toList()))
              .build());
    }

    filters.put(ALPHA_ONLY, ImmutableMap.<String, Object>builder()
            .put(TYPE, "pattern_capture")
            .put(PATTERNS, ALPHA_ONLY_PATTERNS)
            .build());

    filters.put(SHINGLE_2_3, ImmutableMap.<String, Object>builder()
            .put(TYPE, "shingle")
            .put(MIN_SHINGLE_SIZE, "2")
            .put(MAX_SHINGLE_SIZE, "3")
            .build());

    filters.put(MULTIFILTER, ImmutableMap.<String, Object>builder()
            .put(TYPE, "multiplexer")
            .put(FILTERS, ImmutableList.of(
                    MULTIFILTER_1,
                    MULTIFILTER_2,
                    MULTIFILTER_3
            ))
            .build());

    filters.put(MULTIFILTER_GRAPH, ImmutableMap.<String, Object>builder()
            .put(TYPE, "multiplexer")
            .put(FILTERS, ImmutableList.of(
                    MULTIFILTER_GRAPH_1,
                    MULTIFILTER_GRAPH_2,
                    MULTIFILTER_GRAPH_3
            ))
            .build());

    Resource[] synonyms = resourceResolver.getResources("classpath:elasticsearch/synonyms/*.txt");
    for (Resource syn: synonyms) {
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(syn.getInputStream()))) {
        filters.put(String.format("%s_syn_graph", FilenameUtils.getBaseName(syn.getFilename())), ImmutableMap.<String, Object>builder()
                .put(TYPE, "synonym_graph")
                .put(LENIENT, "true")
                .put(SYNONYMS, reader.lines()
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                        .collect(Collectors.toList()))
                .build());
      }
    }

    return filters.build();
  }

  private static Map<String, Object> buildTokenizers() {
    ImmutableMap.Builder<String, Object> tokenizers = ImmutableMap.builder();
    // Tokenize by slashes
    tokenizers.put(SLASH_TOKENIZER,
        ImmutableMap.<String, Object>builder()
                .put(TYPE, PATTERN)
                .put(PATTERN, "[/]")
                .build());

    // Tokenize by whitespace and most special chars
    tokenizers.put(MAIN_TOKENIZER,
            ImmutableMap.<String, Object>builder()
                    .put(TYPE, PATTERN)
                    .put(PATTERN, "[\\s(),./]")
                    .build());

    return tokenizers.build();
  }

  // Normalizers return a single token for a given string. Suitable for keywords
  private static Map<String, Object> buildNormalizers() {
    ImmutableMap.Builder<String, Object> normalizers = ImmutableMap.builder();
    // Analyzer for partial matching (i.e. autocomplete) - Prefix matching of each token
    normalizers.put(KEYWORD_NORMALIZER,
        ImmutableMap.<String, Object>builder().put(FILTER, ImmutableList.of(LOWERCASE, ASCII_FOLDING)).build());

    return normalizers.build();
  }

  // Analyzers turn fields into multiple tokens
  private static Map<String, Object> buildAnalyzers(String mainTokenizer) {
    ImmutableMap.Builder<String, Object> analyzers = ImmutableMap.builder();
    // For special analysis, the substitution can be read from the configuration (chinese tokenizer: ik_smart / smartCN)
    // Analyzer for partial matching (i.e. autocomplete) - Prefix matching of each token
    analyzers.put(PARTIAL_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, StringUtils.isNotBlank(mainTokenizer) ? mainTokenizer : MAIN_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    LOWERCASE,
                    CUSTOM_DELIMITER,
                    TRIM_COLON,
                    URN_STOP)
            ).build());

    // Analyzer for text tokenized into words (split by spaces, periods, and slashes)
    analyzers.put(TEXT_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, StringUtils.isNotBlank(mainTokenizer) ? mainTokenizer : MAIN_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    MULTIFILTER,
                    LOWERCASE,
                    STOP,
                    UNIQUE,
                    STEM_OVERRIDE,
                    SNOWBALL,
                    MIN_LENGTH_2)
            ).build());

    analyzers.put(TEXT_SEARCH_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, StringUtils.isNotBlank(mainTokenizer) ? mainTokenizer : KEYWORD_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    MULTIFILTER_GRAPH,
                    LOWERCASE,
                    STOP,
                    UNIQUE,
                    STEM_OVERRIDE,
                    SNOWBALL,
                    MIN_LENGTH_2
                    )
            ).build());

    // Analyzer for splitting by slashes (used to get depth of browsePath)
    analyzers.put(SLASH_PATTERN_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, SLASH_TOKENIZER)
            .put(FILTER, ImmutableList.of(LOWERCASE))
            .build());

    // Analyzer for matching browse path
    analyzers.put(BROWSE_PATH_HIERARCHY_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, PATH_HIERARCHY_TOKENIZER)
            .build());

    // Analyzer for case-insensitive exact matching - Only used when building queries
    analyzers.put(KEYWORD_LOWERCASE_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, KEYWORD_TOKENIZER)
            .put(FILTER, ImmutableList.of("trim", LOWERCASE, ASCII_FOLDING))
            .build());

    // Analyzer for getting urn components
    analyzers.put(URN_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, MAIN_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    MULTIFILTER,
                    LOWERCASE,
                    TRIM_COLON,
                    URN_STOP,
                    STOP,
                    UNIQUE,
                    STEM_OVERRIDE,
                    SNOWBALL,
                    MIN_LENGTH_2))
            .build());

    analyzers.put(URN_SEARCH_ANALYZER, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, KEYWORD_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    MULTIFILTER_GRAPH,
                    LOWERCASE,
                    TRIM_COLON,
                    URN_STOP,
                    STOP,
                    UNIQUE,
                    STEM_OVERRIDE,
                    SNOWBALL,
                    MIN_LENGTH_2))
            .build());

    // Analyzer for partial matching urn components
    analyzers.put(PARTIAL_URN_COMPONENT, ImmutableMap.<String, Object>builder()
            .put(TOKENIZER, MAIN_TOKENIZER)
            .put(FILTER, ImmutableList.of(
                    ASCII_FOLDING,
                    CUSTOM_DELIMITER,
                    LOWERCASE,
                    TRIM_COLON,
                    URN_STOP))
            .build());

    return analyzers.build();
  }
}
