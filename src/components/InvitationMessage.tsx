import { Heart } from 'lucide-react'
import './InvitationMessage.css'

export interface InvitationMessageProps {
  message: string
}

export function InvitationMessage({ message }: InvitationMessageProps) {
  return (
    <section className="section invitation-message" id="invitation-message" aria-label="Invitation message">
      <div className="invitation-message__inner" data-reveal>
        <div className="heart-divider" aria-hidden="true">
          <span className="heart-divider__line" />
          <Heart size={11} fill="currentColor" strokeWidth={0} />
          <span className="heart-divider__line" />
        </div>
        <p className="invitation-message__text">{message}</p>
        <div className="heart-divider" aria-hidden="true">
          <span className="heart-divider__line" />
          <Heart size={11} fill="currentColor" strokeWidth={0} />
          <span className="heart-divider__line" />
        </div>
      </div>
    </section>
  )
}

export default InvitationMessage
