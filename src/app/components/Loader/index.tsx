import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
const cn = classNameBuilder('game-settings');

export const GameSettings: React.FC = () => <div className={cn()}></div>;
