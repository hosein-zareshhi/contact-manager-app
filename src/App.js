import {useState, useEffect} from "react";

import {ContactContext} from "./context/contactContext";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";

import {getAllContacts, getAllGroups, createContact, deleteContact} from "./services/contactService";

import {
    AddContact,
    EditConract,
    SearchContact,
    ViewContact,
    Contacts,
    Navbar
} from "./components/index"

import './App.css';
import EditContact from "./components/Contacts/EditContact";
import {confirmAlert} from "react-confirm-alert";
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({});
    const [contactQuery, setContactQuery] = useState({text: ""});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                const {data: groupsData} = await getAllGroups();
                setContacts(contactsData);
                setFilteredContacts(contactsData);
                setGroups(groupsData);

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const createContactForm = async (event) => {
        event.preventDefault();
        const {status, data} = await createContact(contact);

        if (status === 201) {
            try {
                setLoading((prevLoading) => !prevLoading);
                const allContacts = [...contacts, data];

                setContacts(allContacts);
                setFilteredContacts(allContacts);

                setContact({});
                setLoading((prevLoading) => !prevLoading);
                navigate("/contacts");
            } catch (err) {
                console.log(err.message);
                setLoading((prevLoading) => !prevLoading);
            }
        }
    }

    const onContactChange = (event) => {
        setContact({...contact, [event.target.name]: event.target.value})
    }

    const confirmDelete = (contactId, contactFullname) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div dir="rtl"
                         style={{
                             backgroundColor: CURRENTLINE,
                             border: `1px solid ${PURPLE}`,
                             borderRadius: "1em"
                         }}
                         className="p-4">
                        <h1 style={{color: YELLOW}}>پاک کردن مخاطب</h1>
                        <p style={{color: FOREGROUND}}>
                            مطمئنی که میخوای مخاطب {contactFullname} رو پاک کنی ؟
                        </p>
                        <button onClick={() => {
                            removeContact(contactId);
                            onClose()
                        }}
                                className="btn mx-2"
                                style={{backgroundColor: PURPLE}}>
                            مطمئن هستم
                        </button>
                        <button onClick={onClose} className="btn" style={{backgroundColor: COMMENT}}>
                            انصراف
                        </button>
                    </div>
                )
            }
        })
    }

    const removeContact = async (contactId) => {
        const allContacts = [...contacts];
        try {
            const updatedContact = contacts.filter(c => c.id !== contactId);
            setContacts(updatedContact);
            setFilteredContacts(updatedContact);

            const {status} = await deleteContact(contactId);

            if (status !== 200) {
                setContact(allContacts);
                setFilteredContacts(allContacts);
            }
        } catch (err) {
            console.log(err);
            setContact(allContacts);
            setFilteredContacts(allContacts);
        }
    }

    const contactSearch = (event) => {
        setContactQuery({...contactQuery, text: event.target.value});
        const allContact = contacts.filter((contact) => {
            return contact.fullname.toLowerCase().includes(event.target.value.toLocaleLowerCase());
        })
        setFilteredContacts(allContact);
    }


    return (
        <ContactContext.Provider value={{
            loading,
            setLoading,
            contact,
            setContact,
            contactQuery,
            contacts,
            setContacts,
            filteredContacts,
            setFilteredContacts,
            groups,
            onContactChange,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch
        }}>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/contacts"/>}/>
                    <Route path="/contacts"
                           element={<Contacts/>}/>
                    <Route path="/contacts/add"
                           element={<AddContact/>}/>
                    <Route path="/contacts/:contactId" element={<ViewContact/>}/>
                    <Route path="/contacts/edit/:contactId" element={<EditContact/>}/>
                </Routes>
            </div>
        </ContactContext.Provider>

    );
}

export default App;
