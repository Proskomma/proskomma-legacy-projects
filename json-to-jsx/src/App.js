import './App.css';
import { mk1 } from './sample_chapter.json';

function renderContent(content) {
    if (typeof content === 'string') {
        return content;
    }
    return content.map(
        (ce, n) => {
            if (typeof ce === 'string') {
                return ce;
            } else {
                return <span key={n} className={ce.class}>{renderContent(ce.content)}</span>
            }
        }
    )
}

function App() {
  return (
    <div className="App">
        <h1>{mk1.title}</h1>
        {
            mk1.blocks.map(
                (bl, n) =>
                    <div key={n} className={bl.class}>
                        {renderContent(bl.content)}
                    </div>
            )
        }
        <pre>{JSON.stringify(mk1, null, 2)}</pre>
    </div>
  );
}

export default App;
