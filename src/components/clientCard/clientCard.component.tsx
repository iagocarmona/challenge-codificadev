// components/clientCard/clientCard.component.tsx
import React from 'react';
import {
  getInitials,
  maskCellphone,
  maskCNPJ,
  maskDecimalWithAcronym,
} from '@/common/utils/masksUtils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { IClientCardProps } from './clientCard.types';
import { Badge } from '../ui/badge';

export const ClientCard: React.FC<IClientCardProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  // classes de status
  const badgeClasses =
    data.status === 'active'
      ? 'bg-green-500 text-white'
      : 'bg-red-500 text-white';

  return (
    <>
      {/* === DESKTOP (sm+) === */}
      <div className="hidden sm:block">
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center">
                <h2 className="mr-4 text-lg font-medium">{data.name}</h2>
                <Badge className={`${badgeClasses} mr-4`}>
                  {data.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>

            <div className="flex flex-col gap-1 border-l pl-4">
              <p className="text-sm font-medium">CNPJ: {maskCNPJ(data.cnpj)}</p>
              <p className="text-sm text-muted-foreground">
                Telefone: {maskCellphone(data.phone)}
              </p>
              <p className="text-sm text-muted-foreground">
                Pagamento Mensal:{' '}
                {maskDecimalWithAcronym(data.monthlyPayment, 'R$')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(data.id)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogPortal>
                <AlertDialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete?.(data.id)}
                      className="bg-destructive hover:bg-destructive/85"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>
          </div>
        </Card>
      </div>

      {/* === MOBILE (<sm) === */}
      <div className="block sm:hidden">
        <Card className="flex flex-col gap-3 p-4">
          {/* topo: avatar + nome/badge + email */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">{data.name}</h2>
                <Badge className={badgeClasses}>
                  {data.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{data.email}</p>
            </div>
          </div>

          {/* detalhes empilhados */}
          <div className="mt-2 space-y-2 border-t pt-4">
            <p className="text-xs">
              <span className="font-medium">CNPJ:</span>{' '}
              <span>{maskCNPJ(data.cnpj)} </span>
            </p>
            <p className="text-xs">
              <span className="font-medium">Telefone:</span>{' '}
              <span className="text-muted-foreground">
                {maskCellphone(data.phone)}
              </span>
            </p>
            <p className="text-xs">
              <span className="font-medium">Pagamento:</span>{' '}
              <span className="text-muted-foreground">
                {maskDecimalWithAcronym(data.monthlyPayment, 'R$')}
              </span>
            </p>
          </div>

          {/* botões embaixo */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(data.id)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogPortal>
                <AlertDialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete?.(data.id)}
                      className="bg-destructive hover:bg-destructive/85"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>
          </div>
        </Card>
      </div>
    </>
  );
};
