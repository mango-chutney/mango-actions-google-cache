import * as core from '@actions/core';
import parseKey from './parseKey';
import save_cache from './save_cache';
import restore_cache from './restore_cache';

// Todo: Test for gsutil installed
// Todo: Work for multiple OS

async function run() {
  try {
    // Get inputs
    const type = core.getInput('type', { required: true });
    const bucket = core.getInput('bucket', { required: true });
    const key = await parseKey(core.getInput('key', { required: true }));

    // Depending on type depends on if input is required
    if (type === 'save') {
      const paths = core.getInput('paths');
      const overwrite = core.getInput('overwrite');

      await save_cache(bucket, key, paths, overwrite);
    } else if (type === 'restore') {
      const directory = core.getInput('directory');
      console.log('key:', key);

      await restore_cache(bucket, key, directory);
    } else {
      throw new Error('Cache Types must be: save or restore');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
