import archiver from 'archiver';
import {createWriteStream} from 'fs';
import {ensureDirSync} from 'fs-extra';
import {deployFiles} from '../.config/paths';

const OUTPUT_FILE = 'build/foodie-server.zip';

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
    archive.pipe(createWriteStream(OUTPUT_FILE));
    
    console.log(`Bundle written to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(error);
    console.error(error.stack);
  }
})();
