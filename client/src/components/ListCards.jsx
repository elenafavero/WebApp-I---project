import { useNavigate, useLocation } from 'react-router'


function ListCards(props) { // cards
    const navigate = useNavigate();
    const location = useLocation();

    const cards = props.cards;

    return (
        <div
            className="d-flex justify-content-center gap-3 flex-wrap"
            style={{ width: '100vw', minHeight: '100vh', alignItems: 'center', margin: 0, padding: '20px' }}>

            {cards.map((card, index) => (
                <div key={index} className="card small-card">
                    <img
                        src={card.imageUrl}
                        className="card-img-top"
                        alt={card.description}
                    />
                    <div className="card-body">
                        <p className="card-text">{card.description}</p>
                        <p className="card-text"><strong>Bad Luck Index: </strong>{card.bad_luck_index}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListCards;