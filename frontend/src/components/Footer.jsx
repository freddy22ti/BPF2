const Footer = ({kontak, sosialMedia}) => {

    return (
        <nav className="bg-gradient-to-r from-cyan-600 to-sky-600">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center items-center h-20">
                    <div className="flex items-center">
                        <p className="text-white text-center">
                            Hubungi Kami: {kontak} | Media Social: {sosialMedia}
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Footer;