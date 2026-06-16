package com.nokia.snake.engine;

/**
 * Game parameters configuration manifest.
 * Stores initialization rules for matrix calculations.
 */
public final class GameConfig {

    public static final int CANVAS_WIDTH = 400;
    public static final int CANVAS_HEIGHT = 300;
    public static final int GRID_SIZE_PX = 20;
    public static final int INITIAL_TICK_RATE_MS = 100;

    private final String profileLevel;
    private final boolean wraparoundEnabled;

    public GameConfig(String profileLevel, boolean wraparoundEnabled) {
        this.profileLevel = profileLevel;
        this.wraparoundEnabled = wraparoundEnabled;
    }

    public String getProfileLevel() { return profileLevel; }
    public boolean isWraparoundEnabled() { return wraparoundEnabled; }
}
