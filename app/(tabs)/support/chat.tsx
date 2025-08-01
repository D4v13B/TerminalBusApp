import { useTheme } from '@/contexts/ThemeContext';
import { Content } from '@/core/entities/DTOs/ChatBot/Content';
import { getResponseChatBot } from '@/infrastructure/chatbot/getResponseChatBot';
import { StatusBar } from 'expo-status-bar';
import { Bot, Send, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBotScreen = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de BusApp. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<Content[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      isBot: false,
      timestamp: new Date(),
    };

    // Agregar mensaje del usuario a la conversación
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Crear el contenido del usuario para la API
    const userContent: Content = {
      parts: [{ text: userMessage }],
      role: 'user'
    };

    // Agregar a la conversación
    const updatedConversation = [...conversation, userContent];
    setConversation(updatedConversation);

    try {
      // Llamar a la API
      const response = await getResponseChatBot({
        message: userMessage,
        conversation: updatedConversation
      });

      if (response && response.msg) {
        // Crear respuesta del bot
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.msg,
          isBot: true,
          timestamp: new Date(),
        };

        // Agregar respuesta del bot a los mensajes
        setMessages(prev => [...prev, botResponse]);

        // Agregar respuesta del bot a la conversación
        const botContent: Content = {
          parts: [{ text: response.msg }],
          role: 'model'
        };
        setConversation(prev => [...prev, botContent]);
      } else {
        // Mensaje de error si no hay respuesta
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Lo siento, no pude procesar tu mensaje. Por favor, inténtalo de nuevo.',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar mensaje de error al usuario
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Ha ocurrido un error de conexión. Verifica tu internet e inténtalo de nuevo.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      // Opcional: mostrar alert
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
    // Opcional: enviar automáticamente
    // setTimeout(() => sendMessage(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessageContainer : styles.userMessageContainer
    ]}>
      <View style={[
        styles.messageCard,
        item.isBot ? styles.botMessage : styles.userMessage
      ]}>
        <View style={styles.messageHeader}>
          {item.isBot ? (
            <Bot size={16} color={theme.colors.primary} style={styles.messageIcon} />
          ) : (
            <User size={16} color={theme.colors.textInverse} style={styles.messageIcon} />
          )}
          <Text style={[
            styles.messageTime,
            { color: item.isBot ? theme.colors.textSecondary : theme.colors.textInverse }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        <Text style={[
          styles.messageText,
          { color: item.isBot ? theme.colors.text : theme.colors.textInverse }
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <View style={[styles.messageCard, styles.botMessage, styles.typingIndicator]}>
        <View style={styles.messageHeader}>
          <Bot size={16} color={theme.colors.primary} style={styles.messageIcon} />
          <Text style={[styles.messageTime, { color: theme.colors.textSecondary }]}>
            escribiendo...
          </Text>
        </View>
        <View style={styles.typingDots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 50,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    messageContainer: {
      marginBottom: theme.spacing.md,
    },
    botMessageContainer: {
      alignItems: 'flex-start',
    },
    userMessageContainer: {
      alignItems: 'flex-end',
    },
    messageCard: {
      maxWidth: '80%',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    botMessage: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.sm,
    },
    userMessage: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: theme.borderRadius.sm,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    messageIcon: {
      marginRight: theme.spacing.xs,
    },
    messageTime: {
      fontSize: 12,
      fontWeight: '500',
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    typingIndicator: {
      minHeight: 60,
    },
    typingDots: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: theme.spacing.xs,
    },
    inputContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
      ...theme.shadows.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.text,
      maxHeight: 100,
      marginRight: theme.spacing.md,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 48,
      minHeight: 48,
      ...theme.shadows.sm,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    quickReplies: {
      marginBottom: theme.spacing.md,
    },
    quickReplyButton: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    quickReplyText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
  });

  const quickReplies = [
    '¿Cómo comprar boletos?',
    'Horarios de rutas',
    'Cancelar reserva',
    'Contactar soporte',
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Chat de Soporte</Text>
        <Text style={styles.subtitle}>Asistente virtual disponible 24/7</Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.messagesContainer}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
      />

      {messages.length === 1 && (
        <View style={[styles.messagesContainer, { flex: 0 }]}>
          <View style={styles.quickReplies}>
            <Text style={[styles.subtitle, { marginBottom: theme.spacing.sm }]}>
              Preguntas frecuentes:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {quickReplies.map((reply, index) => (
                <Pressable
                  key={index}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply)}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <Pressable
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Send 
              size={20} 
              color={!inputText.trim() ? theme.colors.textSecondary : theme.colors.textInverse} 
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBotScreen;