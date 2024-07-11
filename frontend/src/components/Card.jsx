
const Card = ({ judul, children }) => {
    return (
        <div className='w-full h-full bg-white rounded-lg shadow-md p-6'>
            <h1 className="text-3xl font-bold pb-4 mb-4 border-b-2 text-center uppercase">{judul}</h1>
            <div className="mt-10 px-9">
                {children}
            </div>
        </div>
    )
}

export default Card;