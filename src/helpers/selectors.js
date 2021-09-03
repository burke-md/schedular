export function getAppointmentsForDay(state, day) {
  let dayAppointments = [];
  //Iterate through passed in data
  state.days.forEach((x) => {
    if (x.name === day) {
      const thisDay = x;
      //Add the appointments for "day" to the array to be returned.
      thisDay.appointments.forEach((app) => {
        dayAppointments.push(state.appointments[app]);
      });
    }
  });

  return dayAppointments;
}

export function getInterview(state, interview) {
  if (interview !== null) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer],
    };
  }
  return null;
}


export function getInterviewersForDay(state, day) {
  const dayFound = state.days.find(eachDay => eachDay.name === day);
  if(dayFound) {
    
    const interviewersForDay = dayFound.interviewers.map(interviewerId => state.interviewers[interviewerId])
  
    return interviewersForDay;
  }


  return [];
}