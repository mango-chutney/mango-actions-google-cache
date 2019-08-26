# Google Cloud Storage Cache | Github Action

A github action to upload and download caches to and from google cloud storage buckets.

## Options

#### Type [Required]

The type of caching action to perform.

Default Value: `undefined`

Possible Values:

```
'save' | 'restore'
```

#### Bucket [Required]

The Bucket to be used when saving and restoring cache files.

Default Value: `undefined`

#### Key

The Key to be used when saving your cached compressed file to the google cloud storage bucket. You should make this as unique as you plan to have "versions" of a certain cache.

To help with this the key option is parsed specially with a helper. Functions include

**Checksum** To checksum a file you can pass in the file name wrapped in curved brackets `()` For example the following will replace `(gatsby/package.json)` with a checksum string of the package.json file:

```
    key: 'node-modules-cache-(gatsby/package.json)-node-12.7.0'
```

**Note** Checksum does not combine with the `directory` option so please use absolute paths begining from the working directory

Default Value: `cache`

#### Paths [Required][only save action]

The paths to the files that are to be compressed and cached. Paths can be used in combination with the Directory Option to cache subdirectory files easily.

Default Value: `undefined`

Example:

```
paths: 'node_modules yarn.lock'
```

#### Directory

Optional: The directory that source will be compressed from or extracted too when saving or restoring a cache.

Default Value: `.`

Example:

```
directory: 'gatsby'
```

#### Overwrite [Only Save Action]

Whether or not to overwrite the cache file currently in the Google Cloud Storage Bucket if the key is the same. Usefull for bailing out execution when you have "Identical" caches when set to `no`.

Default Value: `yes`

Possible Values:

```
'yes' | 'no'
```

#### Threshold [Only Save Action]

The parallel composite upload threshold in Mibibytes, Must be a number.

Default Value: `50`

Example:

```
threshold: '75'
```

## Example

Restore Cache into subfolder of current working directory

```
      - name: Restore Node Cache
        uses: mango-chutney/mango-actions-google-cache@releases/v1
        with:
          type: 'restore'
          bucket: '[your bucket name]'
          key: 'node-modules-cache-(gatsby/package.json)-node-12.7.0'
          directory: 'gatsby'
```

Compress and Save Cache from subfolder to Google Cloud Storage Bucket

```
      - name: Upload Cache
        uses: mango-chutney/mango-actions-google-cache@releases/v1
        with:
          type: 'save'
          bucket: '[your bucket name]'
          key: 'node-modules-cache-(gatsby/package.json)-node-12.7.0'
          paths: 'node_modules yarn.lock'
          directory: 'gatsby'
```
