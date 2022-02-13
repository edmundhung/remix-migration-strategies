export default function RemixIframe() {
    const style = {
        height: '100vh',
        display: 'block',
        width: '100%',
        border: 'none',
    };    

    return <iframe title="remix" style={style} src={process.env.REACT_APP_SERVER_ORIGIN} />;
}