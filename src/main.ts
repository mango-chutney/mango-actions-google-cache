import * as core from '@actions/core';
import save_cache from './save_cache';
import restore_cache from './restore_cache';

// Todo: Test for gsutil installed

async function run() {
  try {
    // Get inputs
    const type = core.getInput('type', { required: true });
    const bucket = core.getInput('bucket', { required: true });
    const key = core.getInput('key', { required: true });

    // Depending on type depends on if input is required
    if (type === 'save') {
      const files = core.getInput('files');
      const overwrite = core.getInput('overwrite');
      await save_cache(bucket, key, files.split(' '), overwrite);
    } else if (type === 'restore') {
      const directory = core.getInput('directory');
      await restore_cache(bucket, key, directory);
    } else {
      throw new Error('Cache Types must be: save or restore');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
