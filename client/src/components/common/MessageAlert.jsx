import { useError } from '../../context/ErrorAndSuccessMsgContext'

const ErrorAndSuccessMessage = ({ className }) => {

  const { messages } = useError();

  return (
    <div>
      {messages.length > 0 && (
        <div className='fixed top-4 left-1/2 z-50 w-full max-w-xl px-4 -translate-x-1/2'>
          <div className='flex flex-col gap-3'>
            {messages.map((msg, index) => (
                <div 
                  key={`${index}-${msg.message}`}
                  className={`${msg.success ? 'border-green-500 bg-green-500/50' : 'border-rose-500 bg-rose-500/50'} flex items-center gap-3 border p-3 h-auto rounded-2xl ${className} `}
                >
                  {msg.success ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className='h-5 w-5'>
                      <circle cx="50" cy="50" r="45" fill="#22c55e"/>
                      <path
                        d="M30 52 L45 67 L72 35"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ): (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className='h-5 w-5'>
                      <circle cx="50" cy="50" r="45" className='bg-rose-500' fill='' />
                      <rect x="46" y="22" width="8" height="42" rx="4" fill='#ffffff' />
                      <circle cx="50" cy="76" r="5" className='bg-r' fill='#ffffff' />
                    </svg>
                  )}
                  <p className='text-white'>
                    {msg.message}
                  </p>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ErrorAndSuccessMessage
