import styled from 'styled-components';

interface StyledProps {
  isRTL?: boolean;
}

interface ExpandableProps {
  expanded: boolean;
}

export const TranscriptionContainer = styled.div<StyledProps>`
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: ${(props: StyledProps) => props.isRTL ? 'right' : 'left'};
  direction: ${(props: StyledProps) => props.isRTL ? 'rtl' : 'ltr'};
  unicode-bidi: bidi-override;
  font-family: ${(props: StyledProps) => props.isRTL ? 'Heebo, Arial' : 'inherit'};
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  font-size: 1rem;
  line-height: 1.5;
  color: #ffffff;
  width: 100%;
`;

export const KeyPointsList = styled.ul<StyledProps>`
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  text-align: ${(props: StyledProps) => props.isRTL ? 'right' : 'left'};
  direction: ${(props: StyledProps) => props.isRTL ? 'rtl' : 'ltr'};
  unicode-bidi: bidi-override;
  font-family: ${(props: StyledProps) => props.isRTL ? 'Heebo, Arial' : 'inherit'};

  li {
    position: relative;
    padding-${(props: StyledProps) => props.isRTL ? 'right' : 'left'}: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.5;

    &:before {
      content: '•';
      position: absolute;
      ${(props: StyledProps) => props.isRTL ? 'right' : 'left'}: 0.5em;
      color: #4a9eff;
    }
  }
`;

export const SectionTitle = styled.h3`
  color: #ffffff;
  margin: 1.5rem 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

export const TranscriptionSection = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const TranscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TranscriptionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

export const TranscriptionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #9ca3af;
`;

export const RecordingDot = styled.div<{ isRecording: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isRecording ? '#ef4444' : '#9ca3af'};
  animation: ${props => props.isRecording ? 'pulse 1.5s infinite' : 'none'};

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const Logo = styled.button`
  width: 300px;
  height: 60px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    margin: 0;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
  }

  &:hover {
    transform: scale(1.02);
  }
`;

export const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`;

export const TranscriptionContent = styled.div`
  padding: 0;
  margin-top: 1rem;
  width: 100%;
`;

export const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: center;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.15rem 1rem;
  height: 80px;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-self: start;
  svg {
    width: 24px;
    height: 24px;
    color: #ffffff;
  }
`;

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-self: end;
`;

export const HistoryEntry = styled.div<ExpandableProps>`
  background-color: #2a2a2a;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: ${props => props.expanded ? '16px' : '12px'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: ${props => props.expanded ? 'auto' : '60px'};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.expanded ? 'flex-start' : 'center'};
  position: relative;

  &:hover {
    background-color: #333333;
  }
`;

export const HistoryTitle = styled.div<ExpandableProps>`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: ${props => props.expanded ? '12px' : '4px'};
  padding-right: 24px;
`;

export const HistoryDate = styled.div`
  font-size: 12px;
  color: #888888;
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const HistoryPreview = styled.div<ExpandableProps>`
  font-size: 14px;
  color: #cccccc;
  margin-top: ${props => props.expanded ? '8px' : '0'};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.expanded ? 'none' : '1'};
  -webkit-box-orient: vertical;
`;

export const HistoryContent = styled.div`
  font-size: 14px;
  color: #cccccc;
  margin-top: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const HistoryContainer = styled.div`
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 64px);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }
`; 