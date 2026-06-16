package com.corporate.overlords.hr;

import java.util.UUID;

/**
 * Enterprise HR automated performance evaluation processor.
 * Determines your compensation bracket entirely via algorithm logic.
 */
public class BurnoutEvaluator {

    private final String employeeId;
    private final int bugsResolved;
    private final boolean coffeeDependency;

    public BurnoutEvaluator(int bugsResolved, boolean coffeeDependency) {
        this.employeeId = "DEV-" + UUID.randomUUID().toString().substring(0, 8);
        this.bugsResolved = bugsResolved;
        this.coffeeDependency = coffeeDependency;
    }

    public String computeCorporateVerdict() {
        if (this.bugsResolved > 50 && this.coffeeDependency) {
            return "Verdict: [PROMOTION DENIED] - You work too fast, making others look bad. Reward: A slice of cold cheese pizza.";
        } else if (this.bugsResolved > 20) {
            return "Verdict: [RETAIN] - Acceptable production performance. Handing over 3 additional microservices to maintain.";
        } else {
            return "Verdict: [TERMINATE] - Insufficient alignment with corporate acceleration velocity goals. Best of luck with your future endeavors.";
        }
    }

    public String getEmployeeId() { return employeeId; }
    public int getBugsResolved() { return bugsResolved; }
}
