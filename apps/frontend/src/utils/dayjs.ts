import dayjs from "dayjs";
import "dayjs/locale/fr"; // import locale
import "dayjs/locale/es"; // import locale
import "dayjs/locale/hr"; // import locale
import "dayjs/locale/pt"; // import locale
import "dayjs/locale/id"; // import locale
import duration from "dayjs/plugin/duration";
import isLeapYear from "dayjs/plugin/isLeapYear"; // import plugin
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("fr-fr"); // use locale
dayjs.extend(relativeTime);
dayjs.extend(isLeapYear); // use plugin
dayjs.extend(duration);

const day = dayjs;

export default day;
