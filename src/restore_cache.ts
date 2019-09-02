import * as exec from '@actions/exec';

interface SaveCacheOptions {
  bucket: string;
  key: string;
  directory: string;
}

const restore_cache = async ({ bucket, key, directory }: SaveCacheOptions) => {
  try {
    const remote_cache_file = `gs://${bucket}/${key}.tgz`;

    console.log(`Downloading Cache file: ${remote_cache_file}`);

    let err = '';

    await exec.exec(
      `gsutil -q cp ${remote_cache_file} ${directory}`,
      undefined,
      {
        listeners: {
          stderr: (data: Buffer) => {
            err += data.toString();
          },
        },
        ignoreReturnCode: true,
      },
    );

    if (err.includes('No URLs matched')) {
      throw new Error('No Cache file exists in cache bucket, skipping...');
    }

    const src_dir = `${directory}/${key}.tgz`;

    console.log(`Restoring Cache file: ${src_dir}`);

    await exec.exec(`tar xpzf "${src_dir}" -P -C ${directory}`);
  } catch (err) {
    console.log(err);
  }
};

export default restore_cache;
