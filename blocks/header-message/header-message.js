import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure rows based on the fixed schema from BlockJson
  const [messageRow, policyLinkRow, buttonLabelRow] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('header-message-wrapper');

  const headerMessage = document.createElement('div');
  headerMessage.classList.add('header-message', '-information', '-with-button');
  headerMessage.id = 'cookie-message';

  // Message
  if (messageRow) {
    // message is richtext, so read innerHTML
    const messageCell = messageRow.children[0];
    const messageContent = document.createElement('p'); // Original HTML uses <p> for message content
    moveInstrumentation(messageRow, messageContent);
    messageContent.innerHTML = messageCell?.innerHTML || '';

    // Policy Link (aem-content type, so read href from <a>)
    if (policyLinkRow) {
      const policyLinkCell = policyLinkRow.children[0];
      const policyAnchor = policyLinkCell?.querySelector('a');

      if (policyAnchor) {
        // The original HTML shows the link embedded within the message <p> tag.
        // We need to find the placeholder link in the messageContent and replace it,
        // or append if no placeholder exists.
        // The original HTML has "privacy policy" as the link text.
        // The policyLinkRow contains the raw JCR path, not the label.
        // The label "privacy policy" must come from the messageRow's innerHTML.

        // Create a temporary div to parse the message content and find the link text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messageCell?.innerHTML || '';
        const originalLinkInMessage = tempDiv.querySelector('a');

        if (originalLinkInMessage) {
          // If a link already exists in the message content, update its href
          originalLinkInMessage.href = policyAnchor.href;
          // moveInstrumentation for the policyLinkRow should be applied to the anchor if it's moved
          // but since it's embedded, we'll apply it to the messageContent itself as the primary container.
          // The link itself will inherit instrumentation from the messageContent.
        } else {
          // If no link is found in the message, append a new one.
          // The label for this appended link should ideally come from the message content itself,
          // or a fallback if not present. The buttonLabelRow is for the button, not the policy link.
          const newPolicyLink = document.createElement('a');
          newPolicyLink.href = policyAnchor.href;
          newPolicyLink.textContent = 'Learn more'; // Fallback text if no link label can be extracted
          messageContent.append(newPolicyLink);
        }
      }
    }
    headerMessage.append(messageContent);
  }

  // Button
  if (buttonLabelRow) {
    const buttonCell = buttonLabelRow.children[0]; // buttonLabel is type=text
    const button = document.createElement('button');
    button.id = 'cookie_close';
    button.classList.add('header-message-button');
    moveInstrumentation(buttonLabelRow, button);
    button.textContent = buttonCell?.textContent.trim() || ''; // Read textContent for type=text
    headerMessage.append(button);

    button.addEventListener('click', () => {
      headerMessage.remove();
    });
  }

  wrapper.append(headerMessage);
  block.replaceChildren(wrapper);
}
