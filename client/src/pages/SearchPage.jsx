import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

import { searchJournals } from "../api/journalService";

function SearchPage() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {

        e.preventDefault();

        if (!query.trim()) {
            toast.error("Enter something to search.");
            return;
        }

        try {

            setLoading(true);

            const data = await searchJournals(query);



setResults(data.entries || []);

            setHasSearched(true);

        }  catch (err) {
    toast.error(
        err.response?.data?.message ||
        "Search failed."
    );
} finally {

            setLoading(false);

        }

    };

    return (

            <Layout>

            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Search Journals
                </h1>

                <form
                    onSubmit={handleSearch}
                    className="flex gap-4 mb-8"
                >

                    <input
                        className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Search your journals..."
                        value={query}
                        onChange={(e)=>setQuery(e.target.value)}
                    />

                    <Button type="submit">

                        <Search size={18}/>

                        Search

                    </Button>

                </form>

                {loading && (

                    <LoadingSpinner/>

                )}

                {!loading && hasSearched && results.length===0 && (

                    <Card>

                        <p className="text-center text-slate-500">

                            No journals found.

                        </p>

                    </Card>

                )}

                {!loading && results.length>0 && (

                    <div className="space-y-5">

                        {results.map((journal)=>(

                            <Link
                                key={journal._id}
                                to={`/journals/${journal._id}`}
                            >

                                <Card className="hover:shadow-lg transition cursor-pointer">

                                    <h2 className="font-bold">

                                        {new Date(
                                            journal.createdAt
                                        ).toLocaleDateString()}

                                    </h2>

                                    <p className="text-slate-600 mt-3 line-clamp-3">

                                        {journal.content}

                                    </p>

                                </Card>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        
                </Layout>
    );

}

export default SearchPage;