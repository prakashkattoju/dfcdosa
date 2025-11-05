export default function ConfirmModel({ icon, isOpen, title, onConfirm, onCancel, children }) {
    if (!isOpen) return null;
    return (
        <><div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full flex">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative p-4 text-center bg-white rounded-md shadow dark:bg-gray-800 sm:p-5">
                    {/* <button onClick={onCancel} type="button" className="text-slate-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-slate-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button> */}
                    
                    <svg className="text-slate-400 dark:text-slate-500 w-11 h-11 mb-3.5 mx-auto" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">{icon}</svg>
                    {children}
                    {title && <p className="mb-4 text-[15px] font-medium text-slate-700 text-center">{title || 'Are you sure you want to delete?'} </p>}
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={onCancel} type="button" className="rounded-md bg-[#0085db] px-3 py-1.5 border border-transparent font-medium text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-[#0278c4] focus:shadow-none active:bg-[#0278c4] hover:bg-[#0278c4] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            Cancel
                        </button>
                        <button onClick={onConfirm} type="button" className="rounded-md bg-red-500 px-3 py-1.5 border border-transparent font-medium text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-red-600 focus:shadow-none active:bg-red-600 hover:bg-red-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </div><div className="bg-gray-900 opacity-50 fixed inset-0 z-40"></div></>
    )
}