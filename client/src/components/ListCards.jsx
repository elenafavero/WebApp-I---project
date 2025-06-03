import { useNavigate, useLocation } from 'react-router'


function ListCards(props) { // cards
    const navigate = useNavigate();
    const location = useLocation();

    const cards = props.cards;

    return (
        <div
            className="d-flex justify-content-center gap-3"
            style={{
                width: '100%',
            }}
        >
            {cards.map((card, index) => (
                <div key={index} className="card" style={{ width: '15rem', height: '22rem' }}>
                    <img
                        src={card.imageUrl}
                        className="card-img-top"
                        alt={card.description}
                        style={{ height: '70%', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                        <p className="card-text">{card.description}</p>
                        <p className="card-text text-muted">Bad Luck Index: {card.bad_luck_index}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListCards;