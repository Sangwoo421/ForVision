import '../assets/CSS/style.css';

const Status = ({ spoilage }) => {
    let statusClass = 'StatusGreen';

    if (spoilage == '곰팡이' || spoilage == '상함') {
        statusClass = 'StatusRed';
    } else if (spoilage == '갈변' || spoilage == '마름' || spoilage == '변형') {
        statusClass = 'StatusYellow';
    } else {
        statusClass = 'StatusGreen';
    }

    return (
        <div className='StatusContainer'>
            <div className='StatusContent'>
                <div className={statusClass}></div>
            </div>
        </div>
    );
}

export default Status;
