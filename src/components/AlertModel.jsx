import { useEffect } from "react";

export default function AlertModel({ icon, color, isOpen, title, onCancel, time = 2500 }) {

    useEffect(() => {
        const timeout = setTimeout(() => {
            onCancel()
        }, time);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <><div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full flex">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative p-4 text-center bg-white rounded-md shadow dark:bg-gray-800 sm:p-5">
                    {/* <button onClick={onCancel} type="button" className="text-slate-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-slate-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button> */}

                    {icon && <svg className={`${color} w-11 h-11 mb-3.5 mx-auto`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">{icon === 'error' ? <path xmlns="http://www.w3.org/2000/svg" d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /> : <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />}</svg>}

                    <p className="mb-4 text-[15px] font-medium text-slate-700 text-center">{title} </p>
                    
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={onCancel} type="button" className="rounded-md bg-[#0085db] px-3 py-1.5 border border-transparent font-medium text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-[#0278c4] focus:shadow-none active:bg-[#0278c4] hover:bg-[#0278c4] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            Okay, got it
                        </button>
                    </div>
                </div>
            </div>
        </div><div className="bg-gray-900 opacity-50 fixed inset-0 z-40"></div></>
    )
}