import type { TSelectionRange } from "@/@types/selection";
import { getDateDiff } from "@/utils/date";

class DateManager {
  public range: TSelectionRange[];
  constructor() {
    this.range = [];
  }

  public addRange(range: TSelectionRange): void {
    const isPos1AfterPos2 = range.pos1.isAfter(range.pos2);
    const { startHour, startMinute, endHour, endMinute } = (() => {
      const pos1Hour = range.pos1.get("hour");
      const pos1Minute = range.pos1.get("minute");
      const pos2Hour = range.pos2.get("hour");
      const pos2Minute = range.pos2.get("minute");
      if (pos1Hour * 60 + pos1Minute < pos2Hour * 60 + pos2Minute) {
        return {
          startHour: pos1Hour,
          startMinute: pos1Minute,
          endHour: pos2Hour,
          endMinute: pos2Minute,
        };
      }
      return {
        startHour: pos2Hour,
        startMinute: pos2Minute,
        endHour: pos1Hour,
        endMinute: pos1Minute,
      };
    })();

    const pos1 = isPos1AfterPos2 ? range.pos2 : range.pos1;
    const pos2 = isPos1AfterPos2 ? range.pos1 : range.pos2;
    const dateRange = Math.abs(getDateDiff(pos1, pos2)) + 1;
    for (let i = 0; i < dateRange; i++) {
      const date = pos1.add(i, "day");
      const start = date.set("hour", startHour).set("minute", startMinute);
      const end = date.set("hour", endHour).set("minute", endMinute);
      this._addRange({
        pos1: start,
        pos2: end,
      });
    }
  }

  private _addRange(newRange: TSelectionRange): void {
    for (const range of this.range) {
      if (this._isOverlap(range, newRange)) {
        newRange = this._mergeRange(range, newRange);
        this.range = this.range.filter((r) => r !== range);
        this._addRange(newRange);
        return;
      }
    }
    this.range.push(newRange);
  }

  private _isOverlap(
    range1: TSelectionRange,
    range2: TSelectionRange,
  ): boolean {
    if (range1.pos1.isAfter(range2.pos1) && range1.pos1.isBefore(range2.pos2))
      return true;
    if (range1.pos2.isAfter(range2.pos1) && range1.pos2.isBefore(range2.pos2))
      return true;
    if (range1.pos1.isSame(range2.pos1) || range1.pos1.isSame(range2.pos2))
      return true;
    if (range2.pos1.isAfter(range1.pos1) && range2.pos1.isBefore(range1.pos2))
      return true;
    if (range2.pos2.isAfter(range1.pos1) && range2.pos2.isBefore(range1.pos2))
      return true;
    return false;
  }

  private _mergeRange(
    range1: TSelectionRange,
    range2: TSelectionRange,
  ): TSelectionRange {
    const pos1 = range1.pos1.isBefore(range2.pos1) ? range1.pos1 : range2.pos1;
    const pos2 = range1.pos2.isAfter(range2.pos2) ? range1.pos2 : range2.pos2;
    return {
      pos1,
      pos2,
    };
  }
}

export { DateManager };
