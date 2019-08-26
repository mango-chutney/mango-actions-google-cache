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

    // Bail out if type is not defined
    if (!type || type === '') {
      throw new Error('Cache Types must be: save or restore');
    }

    const bucket = core.getInput('bucket', { required: true });
    const key = await parseKey(core.getInput('key'));
    const directory = core.getInput('directory');

    // Depending on type depends on if input is required
    if (type === 'save') {
      const paths = core.getInput('paths', { required: true });
      const overwrite = core.getInput('overwrite');
      const threshold = core.getInput('threshold');

      await save_cache({ bucket, directory, key, overwrite, paths, threshold });
    } else if (type === 'restore') {
      await restore_cache({ bucket, key, directory });
    } else {
      throw new Error('Cache Types must be: save or restore');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
