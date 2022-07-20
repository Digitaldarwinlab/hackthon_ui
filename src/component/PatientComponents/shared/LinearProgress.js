const progressStyles = {
    container: {
        width: "100%",
        height: 12,
        borderColor: "#fff",
        borderWidth: 3,
        borderRadius: 16,
        justifyContent: "center",
        backgroundColor: "#E6E6FA"
    },
    innerStyle: {
        width: "100%",
        height: 12,
        borderRadius: 16,
        borderColor: "black",
        backgroundColor: "#1E90FF",
    },
};
const LinearProgress = (props) => {
    return (
        <div style={progressStyles.container}>
            <div style={{...progressStyles.innerStyle, ...{ width: props.progress + "%" }}}></div>
        </div>
    )
}
export default LinearProgress;