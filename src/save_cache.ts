import * as exec from '@actions/exec';

const save_cache = async (
  bucket: string,
  key: string,
  files: string[],
  overwrite: string,
) => {
  try {
    const cache_file = `./${key}.tgz`;
    if (!overwrite) {
      try {
        const bucket_file = `${bucket}/${key}.tgz`;
        await exec.exec(`gsutil ls gs://${bucket_file}`);
        console.log(
          'Cache file exists, exiting save_cache without over-writing cache file.',
        );
      } catch {
        console.log(`Compressing cache to ${cache_file}`);
        await exec.exec('tar', ['cpzf', cache_file, ...files, '-P']);
        console.log('Uploading cache to Google Cloud Storage...');
        await exec.exec(`gsutil -o cp -R ${cache_file} ${bucket}`);
      }
    } else {
      console.log(`Compressing cache to ${cache_file}`);
      await exec.exec('tar', ['cpzf', cache_file, ...files, '-P']);
      console.log('Uploading cache to Google Cloud Storage...');
      await exec.exec(`gsutil -o cp -R ${cache_file} ${bucket}`);
    }
  } catch (err) {
    console.log(err);
  }
};

export default save_cache;
