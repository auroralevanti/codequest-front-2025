# Like Functionality Implementation

## Overview
This document describes the implementation of the like functionality that saves likes using the backend when the like button is clicked.

## Files Created/Modified

### 1. `/src/lib/likeService.ts`
- Created a service to handle all like-related API calls
- Functions included:
  - `likePost`: Sends a request to like a post
  - `unlikePost`: Sends a request to unlike a post
  - `checkIfLiked`: Checks if the current user has liked a specific post
  - `getLikeCount`: Gets the total like count for a post

### 2. `/src/hooks/useLike.ts`
- Created a custom React hook to manage like state
- Handles optimistic updates for better user experience
- Manages loading states
- Integrates with the authentication system

### 3. `/src/app/blog/components/post/PostCard.tsx`
- Modified to use the new `useLike` hook
- Updated the like button to show filled/unfilled heart icons
- Added proper authentication checks
- Implemented visual feedback for like actions

## Features Implemented

1. **Backend Integration**: Likes are now saved to the backend when clicked
2. **Authentication Check**: Users must be logged in to like posts
3. **Optimistic Updates**: UI updates immediately for better user experience
4. **Error Handling**: Reverts changes if backend requests fail
5. **Like State Persistence**: Checks if user has already liked a post on load
6. **Visual Feedback**: Pulse animation when liking/unliking

## Usage

The like functionality is automatically available in all PostCard components. When a user clicks the like button:

1. If not authenticated, they'll see an alert to log in
2. If authenticated, the like count updates immediately (optimistic update)
3. A request is sent to the backend to save the like
4. If the request succeeds, the state is confirmed
5. If the request fails, the UI reverts to the previous state

## API Endpoints Used

- `POST /api/v1/likes` - Create a like
- `DELETE /api/v1/likes/:id` - Remove a like
- `GET /api/v1/likes?postId=:id&userId=:id` - Check if user liked a post
- `GET /api/v1/posts/:id` - Get post details including like count