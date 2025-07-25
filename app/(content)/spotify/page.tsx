'use client';

import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import GridLayout from '@/components/grid/layout';
import { FaX, FaSpotify, FaArrowRight, FaUsers, FaFire } from 'react-icons/fa6';
import { spotifyLayouts } from '@/config/grid';

interface ArtistInfo {
    name: string;
    genres: string[];
    followers: number;
    url: string;
    popularity: number;
}

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
    artistInfo?: ArtistInfo | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};

export default function SpotifyPage() {
    const { data, isLoading, error } = useSWR<Spotify>('/api/now-playing', fetcher);

    if (error) return <ErrorDisplay />;
    if (isLoading) return <Loading />;

    // Dynamic title based on playing status
    const pageTitle = data?.isPlaying ? 'Now Playing' : 'Recently Played';
    
    // Dynamic description based on playing status
    const description = data?.isPlaying 
        ? 'Arif is currently listening to on Spotify' 
        : 'Arif recently played on Spotify';

    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container as='article' className='py-8'>
                    <h1 className='font-pixelify-sans text-3xl leading-relaxed mb-4'>{pageTitle}</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium mb-4'>
                                {description}
                            </p>
                            <div className='space-y-3'>
                                <div>
                                    <h2 className='font-pixelify-sans text-2xl'>{data?.title}</h2>
                                    <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>{data?.artist}</p>
                                    <p className='text-gray-600 dark:text-gray-400'>{data?.album}</p>
                                </div>
                                


                                {/* Spotify Links */}
                                <div className='flex flex-wrap items-center gap-3 pt-4'>
                                    <a
                                        href={data?.songUrl ?? '#'}
                                        target='_blank'
                                        rel='noreferrer nofollow noopener'
                                        className='group inline-flex items-center justify-center gap-3 px-5 py-3 text-sm bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-all duration-300'>
                                        <FaSpotify />
                                        Open Track
                                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                    </a>
                                    {data?.artistInfo && (
                                        <a
                                            href={data.artistInfo.url}
                                            target='_blank'
                                            rel='noreferrer nofollow noopener'
                                            className='group inline-flex items-center justify-center gap-3 px-5 py-3 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300'>
                                            <FaSpotify />
                                            View Artist
                                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                This shows my current or most recently played track from Spotify with detailed artist information. 
                                The data is fetched in real-time from the Spotify API and updates automatically.
                            </p>
                        </div>
                    </div>
                </Container>
                
                {/* Grid Layout for Spotify Views */}
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    
                    {/* Album Cover Large */}
                    <div key="spotify-1">
                        <Card 
                            className='relative'
                            style={{
                                backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                            <div className='w-full h-full' />
                        </Card>
                    </div>

                    {/* Artist Info Card */}
                    <div key="spotify-2">
                        <Card className='flex flex-col justify-center p-6'>
                            {data?.artistInfo ? (
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <FaSpotify className='text-[#1DB954]' size='3rem' />
                                        <div>
                                            <h3 className='font-pixelify-sans text-lg line-clamp-1'>{data.artistInfo.name}</h3>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                {formatFollowers(data.artistInfo.followers)} followers
                                            </p>
                                        </div>
                                    </div>
                                    {data.artistInfo.genres.length > 0 && (
                                        <div className='flex flex-wrap gap-1'>
                                            {data.artistInfo.genres.slice(0, 2).map((genre) => (
                                                <span 
                                                    key={genre}
                                                    className='px-2 py-1 bg-gray-200 dark:bg-dark-700 rounded-full text-xs'>
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <FaSpotify className='text-[#1DB954]' size='3rem' />
                                        <div>
                                            <h3 className='font-pixelify-sans text-lg line-clamp-2'>{data?.artist}</h3>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>Artist information unavailable</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Popularity Card */}
                    <div key="spotify-3">
                        <Card className='flex flex-col items-center justify-center p-6'>
                            {data?.artistInfo ? (
                                <>
                                    <FaFire size='2rem' className='mb-3 text-orange-500' />
                                    <p className='text-2xl font-bold'>{data.artistInfo.popularity}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 text-center'>Popularity Score</p>
                                </>
                            ) : (
                                <>
                                    <FaSpotify size='2rem' className='mb-3 text-[#1DB954]' />
                                    <p className='text-sm font-medium text-center'>Listen on Spotify</p>
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Playing Status */}
                    <div key="spotify-4">
                        <Card className='flex flex-col items-center justify-center p-6'>
                            <div className='flex items-center gap-3 mb-3'>
                                {data?.isPlaying && (
                                    <div className='inline-flex items-center justify-center gap-1'>
                                        <div className='w-1 h-4 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_0.62s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                                    </div>
                                )}
                            </div>
                            <p className='text-sm font-medium text-center text-[#1DB954]'>
                                {data?.isPlaying ? 'Now Playing' : 'Recently Played'}
                            </p>
                        </Card>
                    </div>

                    {/* Followers Card */}
                    <div key="spotify-5">
                        <Card className='flex flex-col items-center justify-center p-6'>
                            {data?.artistInfo ? (
                                <>
                                    <FaUsers size='2rem' className='mb-3 text-blue-500' />
                                    <p className='text-lg font-bold'>{formatFollowers(data.artistInfo.followers)}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 text-center'>Followers</p>
                                </>
                            ) : (
                                <>
                                    <FaSpotify className='text-[#1DB954]' size='2rem' />
                                    <p className='text-sm text-gray-600 dark:text-gray-400 text-center mt-3'>No artist data</p>
                                </>
                            )}
                        </Card>
                    </div>

                </GridLayout>
            </main>
        </>
    );
}

function Loading() {
    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container as='article' className='py-8'>
                    <div className='h-6 bg-gray-300 animate-pulse rounded-md w-32 mb-4' />
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div className='space-y-4'>
                            <div className='h-6 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-8 bg-gray-300 animate-pulse rounded-md w-3/4' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-1/2' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-2/3' />
                            <div className='h-20 bg-gray-300 animate-pulse rounded-lg w-full' />
                        </div>
                        <div className='space-y-3'>
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-3/4' />
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`spotify-${i}`}>
                            <Card className='bg-gray-300 animate-pulse'>
                                <div className='w-full h-full' />
                            </Card>
                        </div>
                    ))}
                </GridLayout>
            </main>
        </>
    );
}

function ErrorDisplay() {
    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container as='article' className='py-8'>
                    <h1 className='font-pixelify-sans text-3xl leading-relaxed mb-4'>Spotify</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium text-red-600 dark:text-red-400'>
                                Failed to load Spotify data
                            </p>
                            <p className='text-gray-600 dark:text-gray-400 mt-2'>
                                Unable to fetch current playing track. Please try again later.
                            </p>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                There was an error connecting to the Spotify API. 
                                This could be due to network issues or API limitations.
                            </p>
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`spotify-${i}`}>
                            <Card className='flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/20'>
                                <p className='text-red-600 dark:text-red-400 text-sm'>Failed to load</p>
                            </Card>
                        </div>
                    ))}
                </GridLayout>
            </main>
        </>
    );
}