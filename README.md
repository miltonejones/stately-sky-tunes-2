# Music Machine

This is a music app built with React and XState.

## Overview

The app uses XState to model application state with music-related actions. The main state machine is `musicMachine` which handles navigation and data loading.

The main views are:

- Dashboard - overview of app summary data
- Music list - browse songs, albums, playlists
- Artist view - view songs by an artist
- Search results - search across music entities

React hooks like `useMusic` and `usePlayer` provide components access to the XState instances.

## State Machines

- **musicMachine** - main state machine handling navigation
- **playerMachine** - controls music playback
- **artistMachine** - manages artist entity data
- **playlistMachine** - manages playlist entity data

## React Features

- Custom hooks for accessing state machines:
  - `useMusic` - returns musicMachine instances
  - `usePlayer` - returns playerMachine instance
- State managed by XState and hooks
- React components render UI based on state

## Data Loading

API calls to load data are handled in services associated with state machine transitions. Examples:

- `loadDashboard` - gets summary dashboard data
- `searchMusic` - searches for entities
- `loadListList` - loads list data for view

Results are normalized and stored in state context.

## Deployment

This app is built with Create React App so standard CRA deployment applies:

```
npm run build
npm install -g serve
serve -s build
```

## Future Improvements

- Add more robust search capabilities
- Implement additional music entity models
- Abstract API calls into a data provider layer
- Add authentication and user accounts

## Conclusion

This app shows how React and XState can be used together to model complex application state for a music app. The architecture creates a scalable and robust foundation for future development.
