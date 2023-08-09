import { IDateAnswers, IUserAnswer } from "@/@types/api/event";

const groupAnswerByStartsTime = (answers: IUserAnswer[]): IDateAnswers => {
  const result: IDateAnswers = {};
  for (const answer of answers) {
    for (const unit of answer.units) {
      result[unit.eventTimeUnitId] ??= {
        counts: { available: 0, unavailable: 0, maybe: 0, total: 0 },
        answers: [],
        startsTime: unit.eventTimeUnitId,
      };
      result[unit.eventTimeUnitId].answers.push({
        userId: answer.userId,
        name: answer.userNickname,
        availability: unit.availability,
      });
      result[unit.eventTimeUnitId].counts[unit.availability]++;
      result[unit.eventTimeUnitId].counts["total"]++;
    }
  }
  return result;
};

export { groupAnswerByStartsTime };
