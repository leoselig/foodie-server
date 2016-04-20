import archiver from 'archiver';
import {createWriteStream} from 'fs';
import {ensureDirSync} from 'fs-extra';
import {deployFiles} from '../.config/paths';

(async () => {
  try {
    const archive = archiver('zip');

    archive.bulk([{
      expand: true,
      src: deployFiles,
      dot: true
    }]);

    archive.finalize();

    ensureDirSync('build');
    archive.pipe(createWriteStream('build/foodie-server.zip'));
  } catch (error) {
    console.error(error);
    console.error(error.stack);
  }
})();
