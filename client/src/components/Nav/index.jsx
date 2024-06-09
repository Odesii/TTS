import './style.css'

function Nav(props) {
    // For tracking each of the pages and setting the current page
    const {
        pages = [],
        current,
        setCurrent
    } = props;

    return (
        <nav>
            <ul>
                {/* Set the current page to whichever nav link is clicked */}
                <li className={current.page === pages[0].page ? 'active' : ''} key={pages[0].page}>
                    <span onClick={() => setCurrent(pages[0])}>Profile</span>
                </li>
                <li className={current.page === pages[1].page ? 'active' : ''} key={pages[1].page}>
                    <span onClick={() => setCurrent(pages[1])}>Shop</span>
                    </li>
                <li className={current.page === pages[2].page ? 'active' : ''} key={pages[2].page}>
                    <span onClick={() => setCurrent(pages[2])}>Change E-mail</span>
                </li>
                <li className={current.page === pages[3].page ? 'active' : ''} key={pages[3].page}>
                    <span onClick={() => setCurrent(pages[3])}>Change Password</span>
                </li>
                <li className={current.page === pages[4].page ? 'active' : ''} key={pages[4].page}>
                    <span onClick={() => setCurrent(pages[4])}>Delete Account</span>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
