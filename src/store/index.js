export default require(process.env.NODE_ENV === 'production' ? './configureStore' : './configureStore.dev').default;
