import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";

export default function NotFoundPage() {
    return (
        <main style={{ padding: "24px 0 40px" }}>
            <Container>
                <h1>Сторінку не знайдено</h1>
                <Link to="/">На головну</Link>
            </Container>
        </main>
    );
}
