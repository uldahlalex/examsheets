import {type Sheet, SheetsAtom} from "./SheetsAtom.tsx";
import {useAtom} from "jotai";
import {createBrowserRouter, Outlet, RouterProvider, useNavigate} from "react-router";
import SheetComponent from "./SheetComponent.tsx";

export default function App() {
    
    
    
    return <div>
        <RouterProvider router={createBrowserRouter([
            {
                path: '',
                element: <Home />,
                children: [
                    {
                        element: <SheetComponent />,
                        path: '/:sheetId'
                    }
                ]
            }
            
        ])} />

    
        
        
    </div>;
}

export function Home() {
    const [sheets, setSheets] = useAtom(SheetsAtom);
    const navigate = useNavigate();
    return <>
  
        <div className=" join">            
            <div className="flex flex-col">Vælg en eksamens-sæson:</div>

            {
            sheets.map(sheet =>
                <details key={sheet.name} className="dropdown">
                    <summary className="btn m-1">{sheet.name}</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <span key={sheet.name} className="">
                    <div>{sheet.name}</div>
                    <button className="btn btn-accent join-item" onClick={() => {
                        navigate('/'+sheet.name)
                    }}>Gå til</button>
                    <button className="btn btn-accent join-item" onClick={() => {
                        const d1: Sheet = {...sheet, name: sheet.name+crypto.randomUUID()}

                        const duplicate = [...sheets, d1];
                        setSheets(duplicate)
                    }}>Dupliker</button>
                    <button  className="btn btn-error join-item" onClick={() => {
                        setSheets(sheets.filter(s => s.name !== sheet.name))
                    }}>Slet</button>
                            <button>Download</button>
                </span>
                    </ul>
                </details>
                
                
                
           )
            
        }<button>+Upload fra fil</button></div>
      
        <Outlet />

    </>
}