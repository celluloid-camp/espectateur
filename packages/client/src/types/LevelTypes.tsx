import { t } from 'i18next';

enum Level {
  KINDERGARTEN,
  ELEMENTARY_SCHOOL_1,
  ELEMENTARY_SCHOOL_2,
  MIDDLE_SCHOOL,
  HIGH_SCHOOL,
  HIGHER_EDUCATION,
  RESEARCH
}

const levelLabel = (level: Level) => {
  switch (level) {
    case Level.KINDERGARTEN:
      return t('levels.kinderGarten');
    case Level.ELEMENTARY_SCHOOL_1:
      return t('levels.elementarySchool1');
    case Level.ELEMENTARY_SCHOOL_2:
      return t('levels.elementarySchool2');
    case Level.MIDDLE_SCHOOL:
      return t('levels.middleSchool');
    case Level.HIGH_SCHOOL:
      return t('levels.highSchool');
    case Level.HIGHER_EDUCATION:
      return t('levels.higherEducation');
    case Level.RESEARCH:
      return t('levels.research');
    default:
      return '';
  }
};

const levelsCount = Object.keys(Level).length / 2;

export { Level, levelLabel, levelsCount };