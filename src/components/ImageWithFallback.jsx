import { useState } from "react";
import config from "../config";
const ImageWithFallback = ({ imgfor, filename, title, classname }) => {
    const imgpath = (imgfor === 'location') && `${config.FILE_SRC}/locations/${filename}.jpeg`
    const [imgSrc, setImgSrc] = useState(imgpath);

    const handleError = () => {
        const firstLetter = title?.charAt(0).toLowerCase() || "a";
        setImgSrc(`${config.FILE_SRC}/locations/alter/${firstLetter}.svg`);
    };

return (
    <img
        src={imgSrc}
        alt={title}
        onError={handleError}
        className={classname}
    />
);
};

export default ImageWithFallback;