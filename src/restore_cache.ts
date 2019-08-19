import * as exec from '@actions/exec';

const save_cache = async (bucket: string, key: string, directory: string) => {
  try {
    const remote_cache_file = `${bucket}/${key}.tgz`;
    const dir = directory || '.';

    console.log(`Downloading Cache file: ${remote_cache_file}`);

    exec.exec(`gsutil -q cp ${remote_cache_file} ${dir}`);

    const src_dir = `${dir}/${key}.tgz`;

    console.log(`Restoring Cache file: ${src_dir}`);

    exec.exec(`tar xpzf "${src_dir}" -P`);
  } catch (err) {
    console.log(err);
  }
};

export default save_cache;
