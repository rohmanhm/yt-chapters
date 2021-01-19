import meow from 'meow';
import { parseChapters } from './chapters';

async function main() {
  const cli = meow(
    `
  Usage
    $ yt-chapters <input>

  Options
    --file, -f    File to generate the chapters
    --intro, -i   Default title for 00:00 timestamp (default: Intro)

  Examples
    $ foo -f /path/to/video.mp4
`,
    {
      flags: {
        file: {
          type: 'string',
          alias: 'f',
        },
        intro: {
          type: 'string',
          alias: 'i',
        },
      },
    }
  );

  if (cli.flags.file) {
    const output = await parseChapters(cli.flags.file, {
      intro: cli.flags.intro,
    });
    console.log(output);
    return;
  }

  throw Error('You must provide the file source.');
}

main();
