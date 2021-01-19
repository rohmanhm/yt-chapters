import intervalToDuration from 'date-fns/intervalToDuration';
import execa from 'execa';
import ffprobeStatic from 'ffprobe-static';
import { Metadata } from './types';

const DEFAULT_FIRST_CHAPTER_TITLE = 'Chapter 001';

export async function getChapters(path: string): Promise<Metadata | undefined> {
  const { stdout } = await execa(ffprobeStatic.path, [
    '-show_chapters',
    '-print_format',
    'json',
    path,
  ]);

  return JSON.parse(stdout) as Metadata;
}

function normalizeNumberDigits(n: number | undefined): string {
  const num = n || 0;
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

interface Options {
  intro?: string;
}
export async function parseChapters(
  path: string,
  opt?: Options
): Promise<string> {
  const { intro = 'Intro' } = opt || {};
  const chapters = await getChapters(path);

  let result = '';
  chapters?.chapters.forEach(chapter => {
    const interval = intervalToDuration({
      start: 0,
      end: Number(chapter.start_time) * 1000,
    });
    const time = `${normalizeNumberDigits(
      interval.minutes
    )}:${normalizeNumberDigits(interval.seconds)}`;
    const title =
      chapter.tags.title === DEFAULT_FIRST_CHAPTER_TITLE
        ? intro
        : chapter?.tags.title || intro;

    result += `\n${time} ${title}`;
  });

  return result;
}
