import ReactLoading from "react-loading";

const Loading = () => {
    return (<div className="flex items-center justify-center min-h-screen bg-blue-100">
        <div className="text-blue flex flex-col items-center">
            <h1 className="text-3xl font-bold">Loading</h1>
            <div className="pt-6">
                <ReactLoading type="spin" color="#0000FF" height={100} width={50} />
            </div>
        </div>
    </div>)
}
export default Loading