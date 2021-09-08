import axios from "axios";
import { useState, useEffect } from "react";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("api/interviewers")),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);


  const getSpotsForDay = function (dayObj, appointments) {
    let availableSpots = 0;
    for (const id of dayObj.appointments) {
      //If no appointment, increment available spots 
      const appointment = appointments[id]
      if (!appointment.interview) {
        availableSpots ++
      }
    }
    return availableSpots
  }

  const updateSpots = function (dayName, days, appointments) {
    //Find correct day
    const thisDay = days.find(day => day.name === dayName);
    const spots = getSpotsForDay(thisDay, appointments)
    //Spread and update available spots
    const thisDayUpdate = {...thisDay, spots}
    //Iterate through days, update appropriate day
    const newDays = days.map(day => day.name === dayName ? thisDayUpdate : day)
    return newDays
  }


  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [ ...updateSpots(state.day, state.days, appointments)]

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then((result) => {
        setState({
          ...state,
          appointments,
          days
        });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [ ...updateSpots(state.day, state.days, appointments)]

    return axios.delete(`/api/appointments/${id}`, {}).then((res) => {
      setState({
        ...state,
        appointments,
        days
      });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
