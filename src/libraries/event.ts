import { IDateAnswersResponse, IUserAnswerResponse } from "@/@types/api/event";

const groupAnswerByStartsTime = (
  answers: IUserAnswerResponse[],
): IDateAnswersResponse => {
  const result: IDateAnswersResponse = {};
  for (const answer of answers) {
    for (const unit of answer.units) {
      result[unit.eventTimeUnitId] ??= {
        counts: { available: 0, unavailable: 0, maybe: 0, total: 0 },
        answers: [],
        startsTime: unit.startsAt,
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
