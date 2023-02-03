const attemptResult = require('./attempt_result')
const groupLib = require('./group')

function getWcifEvent(competition, activity) {
  return competition.events.filter((evt) => evt.id == activity.eventId)[0]
}

function getWcifRound(competition, activity) {
  return getWcifEvent(competition, activity).rounds.filter((rd) => rd.id == activity.id())[0]
}

function personalBest(person, evt, type='default') {
  const eventId = evt.eventId
  if (type == 'default') {
    type = ['333bf', '444bf', '555bf', '333fm'].includes(eventId) ? 'single' : 'average'
  }

  var matching = person.personalBests.filter((best) => best.eventId === eventId && best.type === type)
  if (matching.length == 0) {
    return new attemptResult.AttemptResult(0, eventId)
  } else {
    return new attemptResult.AttemptResult(matching[0].best, eventId)
  }
}

function allGroups(competition) {
  return competition.schedule.venues.map((venue) => venue.rooms).flat()
    .map((room) => {
      return room.activities
               .map((activity) => activity.childActivities).flat()
               .map((activity) => new groupLib.Group(activity, room, competition))
    }).flat()
}

function groupForActivityId(competition, activityId) {
  var matching = allGroups(competition).filter((group) => group.wcif.id == activityId)
  if (matching.length) {
    return matching[0]
  }
  return null
}

function groupsForRoundCode(competition, roundCode) {
  return allGroups(competition).filter((group) => roundCode.contains(group.activityCode))
}

module.exports = {
  getWcifEvent: getWcifEvent,
  getWcifRound: getWcifRound,
  personalBest: personalBest,
  allGroups: allGroups,
  groupForActivityId: groupForActivityId,
  groupsForRoundCode: groupsForRoundCode,
}
