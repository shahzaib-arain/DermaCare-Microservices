package com.virtual.dermacare_service.model;


public enum AppointmentStatus {
    AVAILABLE,       // For pre-defined available slots
    BOOKED,         // When patient books the slot
    COMPLETED,      // After appointment is done
    CANCELLED,      // When appointment is cancelled
    RESCHEDULED,    // When appointment is rescheduled
    NO_SHOW         // When patient doesn't show up
}
