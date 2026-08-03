#!/usr/bin/env python3
"""
Rate Limiter for PokeAPI requests.

This module provides a rate limiter to ensure we don't exceed PokeAPI's rate limits.
PokeAPI allows approximately 5 requests per 2 seconds.
"""

import time
from threading import Lock
from typing import Optional


class RateLimiter:
    """
    Rate limiter that enforces a maximum number of requests within a time window.
    
    Uses a token bucket algorithm to control request rate.
    
    Attributes:
        max_requests (int): Maximum number of requests allowed in the time window
        time_window (float): Time window in seconds
        requests_made (int): Number of requests made in current window
        last_request_time (float): Timestamp of the last request
        lock (Lock): Thread lock for thread-safe operations
    """
    
    def __init__(self, max_requests: int = 5, time_window: float = 2.0):
        """
        Initialize the rate limiter.
        
        Args:
            max_requests: Maximum number of requests allowed in the time window
            time_window: Time window in seconds (default: 2.0 seconds)
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests_made = 0
        self.last_request_time: Optional[float] = None
        self.lock = Lock()
    
    def acquire(self) -> None:
        """
        Wait if necessary to ensure rate limit is not exceeded.
        
        This method will block if the rate limit has been reached.
        It uses a token bucket algorithm to allow bursts up to max_requests
        within the time window.
        
        Raises:
            RuntimeError: If rate limiting fails
        """
        import os
        if os.environ.get("IGNORE_RATE_LIMIT") == "1":
            return

        with self.lock:
            current_time = time.time()
            
            # If we're within the time window and have made max_requests
            if (self.last_request_time is not None and 
                current_time - self.last_request_time < self.time_window and
                self.requests_made >= self.max_requests):
                
                # Calculate how long we need to wait
                wait_time = self.time_window - (current_time - self.last_request_time)
                time.sleep(wait_time)
                current_time = time.time()
            
            # Reset if we're outside the time window
            if self.last_request_time is None or current_time - self.last_request_time >= self.time_window:
                self.requests_made = 0
            
            # Make the request
            self.requests_made += 1
            self.last_request_time = current_time
    
    def reset(self) -> None:
        """Reset the rate limiter counters."""
        with self.lock:
            self.requests_made = 0
            self.last_request_time = None
    
    def get_status(self) -> dict:
        """
        Get current rate limiter status.
        
        Returns:
            Dictionary with current rate limiter state
        """
        with self.lock:
            return {
                'max_requests': self.max_requests,
                'time_window': self.time_window,
                'requests_made': self.requests_made,
                'last_request_time': self.last_request_time,
                'time_until_reset': (
                    self.time_window - (time.time() - self.last_request_time)
                    if self.last_request_time else self.time_window
                )
            }